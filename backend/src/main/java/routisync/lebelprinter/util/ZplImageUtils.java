package routisync.lebelprinter.util;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import javax.imageio.ImageIO;

/**
 * Small utility to convert BufferedImage to monochrome bytes for ZPL ^GFA (inline) format.
 * This is a simple implementation: convert to 1-bit per pixel, pack per row, then return hex string.
 */
public class ZplImageUtils {


    /**
     * Convert BufferedImage to ZPL ^GFA inline block (returns {header, hexData} in a holder)
     * header: e.g. "^GFA,<total_bytes>,<bytes_per_row>,<bytes_per_row>,"
     */
    public static String toZplGfa(BufferedImage img) throws Exception {
        // Convert to monochrome (black/white)
        /*BufferedImage mono = new BufferedImage(img.getWidth(), img.getHeight(), BufferedImage.TYPE_BYTE_BINARY);
        Graphics2D g = mono.createGraphics();
        g.setColor(Color.WHITE);
        g.fillRect(0, 0, mono.getWidth(), mono.getHeight());
        g.drawImage(img, 0, 0, null);
        g.dispose();*/
        // Convert to grayscale manually before binary
        BufferedImage gray = new BufferedImage(img.getWidth(), img.getHeight(), BufferedImage.TYPE_BYTE_GRAY);
        Graphics2D gGray = gray.createGraphics();
        gGray.drawImage(img, 0, 0, null);
        gGray.dispose();

// Apply threshold to avoid losing logo
        BufferedImage mono = new BufferedImage(img.getWidth(), img.getHeight(), BufferedImage.TYPE_BYTE_BINARY);
        for (int y = 0; y < img.getHeight(); y++) {
            for (int x = 0; x < img.getWidth(); x++) {
                int rgb = gray.getRGB(x, y) & 0xFF; // grayscale intensity
                int value = (rgb < 200) ? 0 : 255;  // threshold (adjust if needed)
                int bw = (value << 16) | (value << 8) | value;
                mono.setRGB(x, y, bw);
            }
        }


        int width = mono.getWidth();
        int height = mono.getHeight();
        int bytesPerRow = (int) Math.ceil(width / 8.0);
        byte[] bytes = new byte[bytesPerRow * height];
        int index = 0;

        for (int y = 0; y < height; y++) {
            int bitIndex = 0;
            int currentByte = 0;
            for (int x = 0; x < width; x++) {
                int rgb = mono.getRGB(x, y);
                int bit = (rgb & 0xFFFFFF) == 0xFFFFFF ? 0 : 1; // white -> 0, black -> 1
                currentByte = (currentByte << 1) | bit;
                bitIndex++;
                if (bitIndex == 8) {
                    bytes[index++] = (byte) (currentByte & 0xFF);
                    bitIndex = 0;
                    currentByte = 0;
                }
            }
            if (bitIndex != 0) { // flush last byte (pad right)
                currentByte = currentByte << (8 - bitIndex);
                bytes[index++] = (byte) (currentByte & 0xFF);
            }
        }

        // Convert bytes to hex string
        StringBuilder hex = new StringBuilder();
        for (byte b : bytes) {
            String h = String.format("%02X", b);
            hex.append(h);
        }

        int totalBytes = bytes.length;
        String header = String.format("^GFA,%d,%d,%d,", totalBytes, totalBytes, bytesPerRow);
        return header + hex.toString();
    }
    public static BufferedImage resize(BufferedImage img, int newW, int newH) {
        java.awt.Image tmp = img.getScaledInstance(newW, newH, java.awt.Image.SCALE_SMOOTH);
        BufferedImage resized = new BufferedImage(newW, newH, BufferedImage.TYPE_INT_ARGB);
        java.awt.Graphics2D g2d = resized.createGraphics();
        g2d.drawImage(tmp, 0, 0, null);
        g2d.dispose();
        return resized;
    }
}
