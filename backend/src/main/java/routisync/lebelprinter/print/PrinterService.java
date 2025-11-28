package routisync.lebelprinter.print;

import java.io.OutputStream;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
public class PrinterService {
    public static void sendToNetworkPrinter(String printerIp, int port, String zpl, int quantity) throws Exception {
        if (quantity <= 0) quantity = 1;

        // Repeat ZPL for the number of labels
        StringBuilder multiZpl = new StringBuilder();
        for (int i = 0; i < quantity; i++) {
            multiZpl.append(zpl);
        }
        try (Socket socket = new Socket(printerIp, port);
             OutputStream out = socket.getOutputStream()) {
            out.write(multiZpl.toString().getBytes(StandardCharsets.UTF_8));
            out.flush();
        }
    }

    // For debugging locally: save to file
    public static void saveToFile(String path, String content) throws Exception {
        java.nio.file.Files.writeString(java.nio.file.Path.of(path), content);
    }
}
