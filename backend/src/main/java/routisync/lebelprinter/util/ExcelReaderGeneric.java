package routisync.lebelprinter.util;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.InputStream;
import java.util.*;

public class ExcelReaderGeneric {

    /**
     * Reads the first sheet, expects header row as row 0.
     * Returns list of maps: each map key = headerName, value = cell string.
     */
    public static List<LinkedHashMap<String, String>> readXlsxToMap(InputStream is) throws Exception {
        List<LinkedHashMap<String, String>> out = new ArrayList<>();
        try (Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rowIt = sheet.iterator();
            if (!rowIt.hasNext()) return out;
            Row headerRow = rowIt.next();
            List<String> headers = new ArrayList<>();
            for (Cell c : headerRow) {
                headers.add(getCellString(c).trim());
            }

            while (rowIt.hasNext()) {
                Row r = rowIt.next();
                if (isRowEmpty(r, headers.size())) continue;
                LinkedHashMap<String, String> map = new LinkedHashMap<>();
                for (int i = 0; i < headers.size(); i++) {
                    Cell cell = r.getCell(i);
                    map.put(headers.get(i), getCellString(cell));
                }
                out.add(map);
            }
        }
        return out;
    }

    private static String getCellString(Cell cell) {
        if (cell == null) return "";
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue();
            case NUMERIC -> {
                if (DateUtil.isCellDateFormatted(cell)) yield cell.getLocalDateTimeCellValue().toLocalDate().toString();
                else {
                    double d = cell.getNumericCellValue();
                    if (d == Math.floor(d)) yield String.valueOf((long)d);
                    else yield String.valueOf(d);
                }
            }
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            case FORMULA -> cell.getCellFormula();
            default -> "";
        };
    }

    private static boolean isRowEmpty(Row row, int headerCount) {
        if (row == null) return true;
        for (int i = 0; i < headerCount; i++) {
            Cell c = row.getCell(i);
            if (c != null && c.getCellType() != CellType.BLANK && !getCellString(c).isBlank()) return false;
        }
        return true;
    }
}

