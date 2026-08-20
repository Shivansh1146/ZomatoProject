package Zomato.Project.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RestaurantRequestDTO {

    @NotBlank(message = "Restaurant name is required")
    @Pattern(
            regexp = "^[a-zA-Z ]+$",
            message = "invalid restaurant name "
    )
    private String restaurantName;

    @NotBlank(message = "Restaurant phone number is required")
    @Pattern(
            regexp = "^[6-9][0-9]{9}$",
            message = "Invalid phone number"
    )
    private String restaurantPhoneNumber;

    @NotBlank(message = "Street Line 1 is required")
    private String streetLine1;

    private String streetLine2;

    @NotBlank(message = "Pin code is required")
    @Pattern(
            regexp = "^[1-9][0-9]{5}$",
            message = "Invalid pin code"
    )
    private String pinCode;

    @NotBlank(message = "State is required")
    @Pattern(
            regexp = "^[a-zA-Z ]+$",
            message = "invalid state"
    )
    private String state;

    @NotBlank(message = "Country is required")
    @Pattern(
            regexp = "^[a-zA-Z ]+$",
            message = "invalid country"

    )
    private String country;

    @NotNull(message = "Latitude is required")
    @DecimalMin(value = "-90", message = "invalid latitude")
    @DecimalMax(value = "90", message = "invalid latitude")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    @DecimalMin(value = "-180", message = "invalid longitude")
    @DecimalMax(value = "180", message = "invalid longitude")
    private Double longitude;
}