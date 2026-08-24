package Zomato.Project.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class MenuItemVariantResponseDTO {

    private Long menuVariantId;
    private String menuVariantName;
    private Double menuVariantPrice;
    private Boolean menuVariantAvailable;
}
