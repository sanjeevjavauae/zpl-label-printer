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
    public static String buildZplForMappedRow(Map<String, String> row) throws Exception {
        /*StringBuilder sb = new StringBuilder();
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
        return sb.toString();*/
        String productName = row.getOrDefault("productName", "");
        String sku = row.getOrDefault("sku", "");
        String price = row.getOrDefault("price", "");
        String expiry = row.getOrDefault("expiryDate", "");
        String ingredients = row.getOrDefault("ingredients", "");
        String barcode = row.getOrDefault("barcode", "");
        String logoPath = row.getOrDefault("logoPath", "");

        StringBuilder zpl = new StringBuilder();
        zpl.append("^XA");                 // Start format
        zpl.append("^PW812");              // 4-inch width (812 dots)
        zpl.append("^LL1218");             // 6-inch height (1218 dots)
        zpl.append("^LH0,0");              // Label Home


        // -----------------------------------------------------------
        // 1️⃣ LOGO (Top-left, fixed size, no overlap)
        // -----------------------------------------------------------
        if (!logoPath.isBlank()) {
            File file = new File(logoPath);
            if (file.exists()) {
                BufferedImage logoImg = ImageIO.read(file);

                // Resize for professional look
                BufferedImage scaled = ZplImageUtils.resize(logoImg, 150, 150);

                String gfa = ZplImageUtils.toZplGfa(scaled);
                zpl.append(gfa);
                zpl.append("^FO30,30^GFA^FS");
            }
        }

        // -----------------------------------------------------------
        // 2️⃣ COMPANY NAME
        // -----------------------------------------------------------
        zpl.append("^FO220,40^A0N,60,60^FDRoutisync^FS");

        // Horizontal line
        zpl.append("^FO30,200^GB740,4,4^FS");

        // -----------------------------------------------------------
        // 3️⃣ PRODUCT NAME
        // -----------------------------------------------------------
        zpl.append("^FO30,240^A0N,50,50^FDProduct: ").append(escapeZpl(productName)).append("^FS");

        // -----------------------------------------------------------
        // 4️⃣ SKU
        // -----------------------------------------------------------
        zpl.append("^FO30,310^A0N,40,40^FDSKU: ").append(escapeZpl(sku)).append("^FS");

        // -----------------------------------------------------------
        // 5️⃣ PRICE
        // -----------------------------------------------------------
        zpl.append("^FO30,370^A0N,45,45^FDPrice: ").append(escapeZpl(price)).append("^FS");

        // -----------------------------------------------------------
        // 6️⃣ EXPIRY
        // -----------------------------------------------------------
        zpl.append("^FO30,430^A0N,45,45^FDExpiry: ").append(escapeZpl(expiry)).append("^FS");

        // -----------------------------------------------------------
        // 7️⃣ INGREDIENTS (multi-line, wrapped automatically)
        // -----------------------------------------------------------
        if (!ingredients.isBlank()) {
            zpl.append("^FO30,490^FB740,5,10,L^A0N,28,28^FD")
                    .append(escapeZpl(ingredients))
                    .append("^FS");
        }

        // -----------------------------------------------------------
        // 8️⃣ BARCODE (centered & large)
        // -----------------------------------------------------------
        if (!barcode.isBlank()) {
            // Printer barcode — no images needed
            zpl.append("^FO100,700");
            zpl.append("^BY3,2,120");
            zpl.append("^BCN,150,Y,N,N");
            zpl.append("^FD").append(escapeZpl(barcode)).append("^FS");
        }

        zpl.append("^XZ");

        return zpl.toString();
    }

    private static String escapeZpl(String s) {
        if (s == null) return "";
        // Basic escaping: remove ^ and ~ which may break ZPL. For production do robust escaping or font handling.
        return s.replace("^", " ").replace("~", " ");
    }
}
