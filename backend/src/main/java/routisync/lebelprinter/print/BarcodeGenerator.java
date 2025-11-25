package routisync.lebelprinter.print;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.oned.Code128Writer;
import com.google.zxing.common.BitMatrix;

import java.awt.*;
import java.awt.image.BufferedImage;
public class BarcodeGenerator {


    /**
     * Generate CODE128 barcode image (width, height)
     */
    public static BufferedImage generateCode128(String data, int width, int height) throws WriterException {
        Code128Writer writer = new Code128Writer();
        BitMatrix matrix = writer.encode(data, BarcodeFormat.CODE_128, width, height, null);

        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_BYTE_BINARY);
        for (int x = 0; x < width; x++) {
            for (int y = 0; y < height; y++) {
                int v = matrix.get(x, y) ? 0xFF000000 : 0xFFFFFFFF;
                image.setRGB(x, y, v);
            }
        }
        return image;
    }
}
