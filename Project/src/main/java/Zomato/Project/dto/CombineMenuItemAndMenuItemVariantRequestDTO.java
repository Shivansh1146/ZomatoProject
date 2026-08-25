package Zomato.Project.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CombineMenuItemAndMenuItemVariantRequestDTO {
    private MenuItemVariantRequestDTO menuItemVariantRequestDTO;
    private Long menuItemId;
    private Long restaurantId;
}
