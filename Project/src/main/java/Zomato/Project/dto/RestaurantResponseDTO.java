package Zomato.Project.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RestaurantResponseDTO {

    private Long restaurantId;
    private String restaurantName;
    private String restaurantPhoneNumber;
    private String streetLine1;
    private String streetLine2;
    private String pinCode;
    private String state;
    private String country;
    private List<MenuItemResponseDTO> menuItemResponseDTOList;


}
