package routisync.lebelprinter.print;

import routisync.lebelprinter.util.ZplImageUtils;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.Map;

/**
 * Creates ZPL for a single mapped product (Map<targetField, value>).
 * targetField expected: sku, productName, manufacturedDate, packagedDate, expiryDate, ingredients, price, barcode, logoPath
 */
public class ZplLabelGenerator {

    /**
     * Generate ZPL for one product. Supports custom label size (widthDots x heightDots).
     * Preserves logo, brand name, product info, barcode, and ingredients exactly as before.
     */
    public static String buildZplForTemplate(Map<String, String> row, int widthDots, int heightDots) throws Exception {
        String productName = row.getOrDefault("productName", "");
        String sku = row.getOrDefault("sku", "");
        String price = row.getOrDefault("price", "");
        String expiry = row.getOrDefault("expiryDate", "");
        String ingredients = row.getOrDefault("IngredientsList", "");
        String barcode = row.getOrDefault("BarCode", "");
        String logoPath = row.getOrDefault("logo_local", "");
        String productImagePath = row.getOrDefault("productImage_local", "");

        StringBuilder sb = new StringBuilder();

        sb.append("^XA\n");
        sb.append("^PW").append(widthDots).append("\n");
        sb.append("^LL").append(heightDots).append("\n");

        // ---------------------------------------------------
        // LOGO (top-left)
        // ---------------------------------------------------
        if (!logoPath.isBlank()) {
            File f = new File(logoPath);
            if (f.exists()) {
                BufferedImage logo = ImageIO.read(f);
                BufferedImage resized = ZplImageUtils.resize(logo, 120, 120);
                String gfa = ZplImageUtils.toZplGfa(resized);
                sb.append("^FO20,20\n");
                sb.append(gfa).append("^FS\n");
            }
        }

        // ---------------------------------------------------
        // BRAND NAME
        // ---------------------------------------------------
        sb.append("^FO220,40^A0N,60,60^FDRoutisync^FS\n");

        // Horizontal line
        sb.append("^FO20,180^GB").append(widthDots - 40).append(",3,3^FS\n");

        // ---------------------------------------------------
        // PRODUCT INFO
        // ---------------------------------------------------
        sb.append("^FO20,220^A0N,48,48^FDProduct: ").append(escapeZpl(productName)).append("^FS\n");
        sb.append("^FO20,280^A0N,38,38^FDSKU: ").append(escapeZpl(sku)).append("^FS\n");
        sb.append("^FO20,330^A0N,38,38^FDPrice: ").append(escapeZpl(price)).append("^FS\n");
        sb.append("^FO20,380^A0N,38,38^FDExpiry: ").append(escapeZpl(expiry)).append("^FS\n");

        // Ingredients (multi-line)
        sb.append("^FO20,430^A0N,26,26^FD\"").append(escapeZpl(ingredients)).append("\"^FS\n");

        // ---------------------------------------------------
        // BARCODE
        // ---------------------------------------------------
        sb.append("^FO100,520^BY3,2,120\n");
        sb.append("^BCN,160,Y,N,N\n");
        sb.append("^FD").append(escapeZpl(barcode)).append("^FS\n");

        sb.append("^XZ\n");
        return sb.toString();
    }

    private static String escapeZpl(String s) {
        if (s == null) return "";
        return s.replace("^", " ").replace("~", " ");
    }
}
