package Zomato.Project.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SoftDelete;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "user")
@SoftDelete
public class User extends Base {

    private String userName;
    private String userEmail;
    private String userPhoneNumber;

    @CreationTimestamp
    private LocalDateTime userAccountCreatedTime;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Address> userAddressList;
}
