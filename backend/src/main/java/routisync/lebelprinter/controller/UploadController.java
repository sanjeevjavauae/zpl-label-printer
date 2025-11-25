package routisync.lebelprinter.controller;
import routisync.lebelprinter.model.Product;
import routisync.lebelprinter.util.ExcelReaderGeneric;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.LinkedHashMap;
import java.util.Map;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UploadController {
    /*@PostMapping(value = "/uploadExcel", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public List<Product> uploadExcel(@RequestPart("file") MultipartFile file) throws Exception {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Empty file");
        }
        return ExcelReader.readXlsx(file.getInputStream());
    }*/
    @PostMapping(value = "/uploadExcelGeneric", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public List<LinkedHashMap<String, String>> uploadExcelGeneric(@RequestPart("file") MultipartFile file) throws Exception {
        if (file == null || file.isEmpty()) throw new IllegalArgumentException("Empty file");
        return ExcelReaderGeneric.readXlsxToMap(file.getInputStream());

    }
}
