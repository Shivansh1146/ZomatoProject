package Zomato.Project.dto;

import Zomato.Project.enums.MenuItemType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class MenuItemRequestDTO {

    @NotBlank(message = "menu item name is required")
    private String menuItemName;

    @NotBlank(message = "menu item description is required")
    private String menuItemDescription;

    @NotNull(message = "menu item type is required")
    private MenuItemType menuItemType;

    @NotBlank
    @Pattern(
            regexp = "^[a-zA-Z ]+$",
            message = "invalid menu item label"
    )
    private String menuItemLabel;

    @NotNull(message = "restaurant Id is required")
    private Long restaurantId;

    @NotEmpty(message = "at least one menu item  variant is required ")
    @Valid
    private List<MenuItemVariantRequestDTO> menuItemVariantRequestDTOList;

}
