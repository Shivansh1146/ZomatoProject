package Zomato.Project.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SoftDelete;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "user")
@SoftDelete
public class User extends Base {

    @Column(name = "name", nullable = false)
    private String userName;

    @Column(name = "email", nullable = false, unique = true)
    private String userEmail;

    @Column(name = "phone_number", nullable = false, unique = true, length = 10)
    private String userPhoneNumber;

//    @Column(name = "verified", nullable = false)
//    private Boolean otpVerified;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Address> userAddressList;
}
