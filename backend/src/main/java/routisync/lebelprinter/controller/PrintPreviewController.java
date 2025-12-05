package routisync.lebelprinter.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import routisync.lebelprinter.print.PrinterService;
import routisync.lebelprinter.print.ZplLabelGenerator;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;

/**
 * Preview endpoint expects:
 * {
 * "mappedRows": [ { "productName": "X", "price": "12", "barcode":"123", ... }, ... ]
 * }
 * <p>
 * It generates ZPL for first N rows (or all) and returns:
 * { "zpl": "...", "previewPngBase64": "data:image/png;base64,..." }
 **/
@RestController
@RequestMapping("/api")
public class PrintPreviewController {
    @PostMapping(value = "/preview", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, String> preview(@RequestBody Map<String, Object> body) throws Exception {
        Object rawRows = body.get("mappedRows");
        Map<String, Object> template = (Map<String, Object>) body.get("template");
        if (rawRows == null || template == null) throw new IllegalArgumentException("mappedRows & template required");

        List<Map<String, String>> mappedRows = new ArrayList<>();
        if (rawRows instanceof List) {
            for (Object o : (List<?>) rawRows) mappedRows.add((Map<String, String>) o);
        } else if (rawRows instanceof Map) mappedRows.add((Map<String, String>) rawRows);

        if (mappedRows.isEmpty()) throw new IllegalArgumentException("mappedRows required");

        int widthDots = (int) template.getOrDefault("widthDots", 406);
        int heightDots = (int) template.getOrDefault("heightDots", 406);

        StringBuilder zplAll = new StringBuilder();
        for (Map<String, String> row : mappedRows) {
            String zpl = ZplLabelGenerator.buildZplForTemplate(row, widthDots, heightDots);
            zplAll.append(zpl).append("\n");
            if (zplAll.length() > 20000) break;
        }

        //URL url = new URL("http://api.labelary.com/v1/printers/8dpmm/labels/" + widthDots/203 + "x" + heightDots/203 + "/0/");
        double widthInch = widthDots / 203.0;
        double heightInch = heightDots / 203.0;

// Scale slightly to avoid text cut (1.2 = 20% extra canvas)
        double scaledWidth = widthInch * 1.2;
        double scaledHeight = heightInch * 1.2;

// Use higher resolution (12dpmm) for better preview quality
        URL url = new URL("http://api.labelary.com/v1/printers/12dpmm/labels/"
                + scaledWidth + "x" + scaledHeight + "/0/");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setDoOutput(true);
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Accept", "image/png");
        conn.getOutputStream().write(zplAll.toString().getBytes("UTF-8"));

        Map<String, String> res = new HashMap<>();
        res.put("zpl", zplAll.toString());

        if (conn.getResponseCode() == 200) {
            try (InputStream is = conn.getInputStream()) {
                byte[] bytes = is.readAllBytes();
                String base64 = Base64.getEncoder().encodeToString(bytes);
                res.put("previewPngBase64", "data:image/png;base64," + base64);
            }
        }
        res.put("template", template.toString());
        return res;
    }


    @PostMapping(value = "/printToNetwork", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, String> printToNetwork(@RequestBody Map<String, Object> body) throws Exception {

        // Get mapped rows
        Object rawRows = body.get("mappedRows");
        if (rawRows == null) throw new IllegalArgumentException("mappedRows required");

        List<Map<String, String>> mappedRows = new ArrayList<>();
        if (rawRows instanceof List<?>) {
            for (Object o : (List<?>) rawRows) {
                mappedRows.add((Map<String, String>) o);
            }
        } else if (rawRows instanceof Map<?, ?>) {
            mappedRows.add((Map<String, String>) rawRows);
        } else {
            throw new IllegalArgumentException("Invalid mappedRows format");
        }

        if (mappedRows.isEmpty()) throw new IllegalArgumentException("mappedRows required");

        // Get printer IP
        // Get printer IP safely
        Object printerIpObj = body.get("printerIp");
        String printerIp = null;

        if (printerIpObj instanceof String) {
            printerIp = ((String) printerIpObj).trim();
        } else if (printerIpObj instanceof Map<?, ?>) {
            // If printerIp is sent as { "ip": "192.168.1.100" }
            Map<?, ?> ipMap = (Map<?, ?>) printerIpObj;
            Object ipValue = ipMap.get("ip");
            if (ipValue instanceof String) {
                printerIp = ((String) ipValue).trim();
            }
        }

        if (printerIp == null || printerIp.isBlank()) {
            throw new IllegalArgumentException("printerIp required or invalid");
        }

// Now printerIp is safely extracted and can be used
        System.out.println("Printer IP: " + printerIp);
        // Get quantity
        Integer quantity = 1;
        Object qtyObj = body.get("quantity");
        if (qtyObj instanceof Number) quantity = ((Number) qtyObj).intValue();

        // Extract template dimensions
        Map<String, Object> templateMap = (Map<String, Object>) body.get("template");
        if (templateMap == null) throw new IllegalArgumentException("template required");

        int widthDots = ((Number) templateMap.get("widthDots")).intValue();
        int heightDots = ((Number) templateMap.get("heightDots")).intValue();

        // Send each row to printer
        for (Map<String, String> row : mappedRows) {
            String zpl = ZplLabelGenerator.buildZplForTemplate(row, widthDots, heightDots); // Only width & height
            PrinterService.sendToNetworkPrinter(printerIp, 9100, zpl, quantity);
        }

        Map<String, String> res = new HashMap<>();
        res.put("status", "sent " + quantity + " copies per label");
        return res;
    }


}

