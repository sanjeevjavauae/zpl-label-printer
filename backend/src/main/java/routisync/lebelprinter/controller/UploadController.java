package routisync.lebelprinter.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import routisync.lebelprinter.util.ExcelReaderGeneric;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class UploadController {
    private final List<LinkedHashMap<String, String>> products = new ArrayList<>();
    String serverHost = "http://localhost:8080";
    @PostMapping(value = "/uploadExcelGeneric", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public List<LinkedHashMap<String, String>> uploadExcelGeneric(@RequestPart("file") MultipartFile file) throws Exception {
        if (file == null || file.isEmpty()) throw new IllegalArgumentException("Empty file");
        List<LinkedHashMap<String, String>> list = ExcelReaderGeneric.readXlsxToMap(file.getInputStream());
        // Define all Excel columns that contain image file paths
        List<String> imageColumns = List.of("productImage", "logo"); // add more if needed

        for (LinkedHashMap<String, String> row : list) {
            for (String column : imageColumns) {
                String imagePath = row.get(column);  // Original Excel path
                if (imagePath != null && !imagePath.isEmpty()) {
                    Path sourcePath = Paths.get(imagePath);
                    if (!Files.exists(sourcePath)) continue;

                    String filename = sourcePath.getFileName().toString();
                    Path targetPath = Paths.get("uploaded-images").resolve(filename).normalize();
                    Files.createDirectories(targetPath.getParent());
                    Files.copy(sourcePath, targetPath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

                    // For ZPL
                    row.put(column + "_local", sourcePath.toAbsolutePath().toString());

                    // For frontend display
                    row.put(column + "_url", serverHost + "/images/" + filename);
                }
            }
        }

// Replace old products instead of adding
        products.clear();
        products.addAll(list);
        return list;

    }
    @GetMapping("/products")
    public List<LinkedHashMap<String, String>> getProducts() {
        return products;
    }
    @GetMapping("/images/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) throws MalformedURLException {
        Path path = Paths.get("uploaded-images").resolve(filename).normalize();
        Resource resource = new UrlResource(path.toUri());
        Resource file = new UrlResource(path.toUri());
        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(resource);
    }
}
