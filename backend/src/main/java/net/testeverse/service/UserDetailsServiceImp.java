package net.testeverse.service;

import net.testeverse.entity.User;
import net.testeverse.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.lang.reflect.Array;
import java.util.Arrays;

@Service
public class UserDetailsServiceImp implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findUserByUsername(username);

        if(user != null) {
            final UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                    .username(user.getUsername()).password(user.getPassword())
                    .roles(String.valueOf(Arrays.asList(user.getRoles()))).build();

            return userDetails;
        }

        throw new UsernameNotFoundException("User not found with username: " + username);
    }
}
