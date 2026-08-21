package Zomato.Project.dto;


import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MenuItemVariantRequestDTO {

    @NotBlank(message = "menu variant name is required")
    private String menuVariantName;

    @NotNull(message = "menu variant price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "price must be greater than zero")
    private Double menuVariantPrice;

    @NotNull(message = "menu variant available is required")
    private Boolean menuVariantAvailable;

    @NotNull(message = "inventory managed is required")
    private Boolean inventoryManaged;

    @Min(value = 0, message = "inventory cannot be negative")
    private Long currentAvailableInventoryCount;

}
