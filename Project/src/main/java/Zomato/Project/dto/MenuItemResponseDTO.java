package Zomato.Project.dto;

import Zomato.Project.enums.MenuItemType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemResponseDTO {
    private Long menuItemId;
    private String menuItemName;
    private String menuItemDescription;
    private MenuItemType menuItemType;
    private String menuItemLabel;
    private List<MenuItemVariantResponseDTO> menuItemVariantResponseDTOList;
}
