package Zomato.Project.service;

import Zomato.Project.dto.UserRequestDTO;
import Zomato.Project.dto.UserResponseDTO;
import Zomato.Project.entity.User;
import Zomato.Project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public String addUser(UserRequestDTO userRequestDTO) {
        Optional<User> existingUserEmail = userRepository.findByUserEmail(userRequestDTO.getUserEmail());
        if (existingUserEmail.isPresent()) {
            return "user email  is already exist ";
        }

        Optional<User> existingPhoneNumber = userRepository.findByUserPhoneNumber(userRequestDTO.getUserPhoneNumber());
        if (existingPhoneNumber.isPresent()) {
            return "user phone number is already exist";
        }
        User user = convertDTOToEntity(userRequestDTO);
        userRepository.save(user);
        return "Successful user is added";
    }

    private User convertDTOToEntity(UserRequestDTO userRequestDTO) {
        User user = new User();
        user.setUserName(userRequestDTO.getUserName());
        user.setUserEmail(userRequestDTO.getUserEmail());
        user.setUserPhoneNumber(userRequestDTO.getUserPhoneNumber());
        return user;
    }

    public String deleteUser(Long userId) {
        Optional<User> checkUser = userRepository.findById(userId);
        if (checkUser.isEmpty()) {
            return "user does not exist";
        }
        userRepository.deleteById(userId);
        return "Successful user is deleted";
    }

    public String editUser(Long userId, UserRequestDTO userRequestDTO) {
        Optional<User> checkUser = userRepository.findById(userId);
        if (checkUser.isEmpty()) {
            return "user does not exist";
        }
        Optional<User> checkDuplicateEmail = userRepository.findByUserEmail(userRequestDTO.getUserEmail());
        if (checkDuplicateEmail.isPresent() && !checkDuplicateEmail.get().getId().equals(userId)) {
            return "user email already exist";
        }
        Optional<User> checkDuplicatePhoneNumber = userRepository.findByUserPhoneNumber(userRequestDTO.getUserPhoneNumber());
        if (checkDuplicatePhoneNumber.isPresent() && !checkDuplicatePhoneNumber.get().getId().equals(userId)) {
            return "user phone number already exist";
        }
        User existingUser = checkUser.get();

        existingUser.setUserName(userRequestDTO.getUserName());
        existingUser.setUserPhoneNumber(userRequestDTO.getUserPhoneNumber());
        existingUser.setUserEmail(userRequestDTO.getUserEmail());

        userRepository.saveAndFlush(existingUser);
        return "Succesfull user is updated";

    }

    public UserResponseDTO getByUserId(Long userId) {
        Optional<User> checkUser = userRepository.findById(userId);
        if (checkUser.isEmpty()) {
            return null;
        }
        User users = checkUser.get();
        return convertEntityToResponseDTO(users);

    }

    private UserResponseDTO convertEntityToResponseDTO(User user) {
        UserResponseDTO userResponseDTO = new UserResponseDTO();
        userResponseDTO.setUserId(user.getId());
        userResponseDTO.setUserName(user.getUserName());
        userResponseDTO.setUserEmail(user.getUserEmail());
        userResponseDTO.setUserPhoneNumber(user.getUserPhoneNumber());

        return userResponseDTO;

    }

    public List<UserResponseDTO> getAllUser() {

        List<User> userList = userRepository.findAll();
        List<UserResponseDTO> userResponseDTOList = new ArrayList();
        for (User Users : userList) {

            userResponseDTOList.add(convertEntityToResponseDTO(Users));
        }
        return userResponseDTOList;
    }
}
