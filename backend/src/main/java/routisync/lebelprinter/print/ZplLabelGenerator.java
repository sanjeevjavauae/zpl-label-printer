package routisync.lebelprinter.print;

import routisync.lebelprinter.util.ZplImageUtils;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;

/**
 * Creates ZPL for a single mapped product (Map<targetField, value>).
 * targetField expected: sku, productName, manufacturedDate, packagedDate, expiryDate, ingredients, price, barcode, logoPath
 */
public class ZplLabelGenerator {


    /**
     * Generate ZPL for one product. x/y coordinates are basic — adjust for your label size (mm -> dots conversion).
     * Returns ZPL string.
     */
    public static String buildZplForMappedRow(Map<String, String> mappedRow) throws Exception {
        StringBuilder sb = new StringBuilder();
        sb.append("^XA\n");

        // If logo path is provided and file exists, embed it as inline GFA
        String logoPath = mappedRow.getOrDefault("logoPath", "");
        if (!logoPath.isBlank()) {
            File f = new File(logoPath);
            if (f.exists()) {
                BufferedImage logo = ImageIO.read(f);
                // scale down if large — optional
                String gfa = ZplImageUtils.toZplGfa(logo);
                // embed inline and render at 20,20 (adjust as needed)
                sb.append(gfa).append("\n");
                sb.append("^FO20,20^GFA^FS\n"); // note: ^GFA inline already included. Some printers require ^XG; this tries inline.
            }
        }

        // Product name
        String name = mappedRow.getOrDefault("productName", "");
        sb.append("^FO20,120^A0N,40,40^FD").append(escapeZpl(name)).append("^FS\n");

        // Generate barcode image inline and embed (if barcode present)
        String barcode = mappedRow.getOrDefault("barcode", "");
        if (!barcode.isBlank()) {
            BufferedImage barcodeImg = BarcodeGenerator.generateCode128(barcode, 380, 80);
            String barcodeGfa = ZplImageUtils.toZplGfa(barcodeImg);
            sb.append(barcodeGfa).append("\n");
            sb.append("^FO20,180^GFA^FS\n");
        } else {
            // fallback to printer barcode command
            sb.append("^FO20,180^BY2^BCN,80,Y,N,N^FD").append(escapeZpl(barcode)).append("^FS\n");
        }

        // Price and expiry
        String price = mappedRow.getOrDefault("price", "");
        String expiry = mappedRow.getOrDefault("expiryDate", "");
        sb.append("^FO20,280^A0N,30,30^FDPrice: ").append(escapeZpl(price)).append("^FS\n");
        sb.append("^FO20,320^A0N,30,30^FDExpiry: ").append(escapeZpl(expiry)).append("^FS\n");

        // Ingredients (small)
        String ingredients = mappedRow.getOrDefault("ingredients", "");
        sb.append("^FO20,360^A0N,20,20^FD").append(escapeZpl(ingredients)).append("^FS\n");

        sb.append("^XZ\n");
        return sb.toString();
    }

    private static String escapeZpl(String s) {
        if (s == null) return "";
        // Basic escaping: remove ^ and ~ which may break ZPL. For production do robust escaping or font handling.
        return s.replace("^", " ").replace("~", " ");
    }
}
