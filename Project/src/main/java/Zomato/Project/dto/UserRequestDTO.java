package Zomato.Project.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRequestDTO {

    @NotBlank(message = "user name is required")
    @Pattern(regexp = "^[a-zA-Z ]+$",
            message = "invalid user name"

    )
    private String userName;

    @NotBlank(message = "user email is required")
    @Email(message = "invalid user email")
    private String userEmail;

    @NotBlank(message = "user phone number is required")
    @Pattern(regexp = "^[6-9][0-9]{9}$",
            message = "invalid user Phone Number"
    )
    private String userPhoneNumber;
}
