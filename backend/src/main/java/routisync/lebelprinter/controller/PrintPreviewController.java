package routisync.lebelprinter.controller;
import routisync.lebelprinter.print.ZplLabelGenerator;
import routisync.lebelprinter.print.PrinterService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;

/**
 * Preview endpoint expects:
 * {
 *   "mappedRows": [ { "productName": "X", "price": "12", "barcode":"123", ... }, ... ]
 * }
 *
 * It generates ZPL for first N rows (or all) and returns:
 * { "zpl": "...", "previewPngBase64": "data:image/png;base64,..." }
 * **/
@RestController
@RequestMapping("/api")
public class PrintPreviewController {


    @PostMapping(value = "/preview", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, String> preview(@RequestBody Map<String, Object> body) throws Exception {
        List<Map<String, String>> mappedRows = (List<Map<String, String>>) body.get("mappedRows");
        if (mappedRows == null || mappedRows.isEmpty()) throw new IllegalArgumentException("mappedRows required");

        // For preview we'll create ZPL for first row (or aggregate if you want)
        StringBuilder zplAll = new StringBuilder();
        for (Map<String, String> row : mappedRows) {
            String zpl = ZplLabelGenerator.buildZplForMappedRow(row);
            zplAll.append(zpl).append("\n");
            // limit preview to 5 labels
            if (zplAll.length() > 20000) break;
        }
        String finalZpl = zplAll.toString();

        // Call Labelary API to render PNG (8dpmm, label 4x6 inch). Labelary is a public API for preview.
        // Endpoint: http://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/
        URL url = new URL("http://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setDoOutput(true);
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Accept", "image/png");
        conn.getOutputStream().write(finalZpl.getBytes("UTF-8"));
        int code = conn.getResponseCode();
        Map<String, String> res = new HashMap<>();
        res.put("zpl", finalZpl);

        if (code == 200) {
            try (InputStream is = conn.getInputStream()) {
                byte[] imageBytes = is.readAllBytes();
                String base64 = Base64.getEncoder().encodeToString(imageBytes);
                res.put("previewPngBase64", "data:image/png;base64," + base64);
            }
        } else {
            // on error return nothing for preview (Labelary may reject certain commands)
            try (InputStream err = conn.getErrorStream()) {
                if (err != null) {
                    byte[] errBytes = err.readAllBytes();
                    res.put("labelaryError", new String(errBytes));
                }
            }
        }
        return res;
    }

    @PostMapping(value = "/printToNetwork", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, String> printToNetwork(@RequestBody Map<String, Object> body) throws Exception {
        // body: { "mappedRows": [...], "printerIp": "192.168.1.100" }
        List<Map<String, String>> mappedRows = (List<Map<String, String>>) body.get("mappedRows");
        String printerIp = (String) body.get("printerIp");
        if (mappedRows == null || mappedRows.isEmpty()) throw new IllegalArgumentException("mappedRows required");
        if (printerIp == null || printerIp.isBlank()) throw new IllegalArgumentException("printerIp required");

        for (Map<String, String> row : mappedRows) {
            String zpl = ZplLabelGenerator.buildZplForMappedRow(row);
            PrinterService.sendToNetworkPrinter(printerIp, 9100, zpl);
        }
        Map<String, String> r = new HashMap<>();
        r.put("status", "sent");
        return r;
    }
}

