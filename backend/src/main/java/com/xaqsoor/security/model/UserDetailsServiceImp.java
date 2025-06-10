package com.xaqsoor.security.model;

import com.xaqsoor.entity.User;
import com.xaqsoor.entity.UserCredential;
import com.xaqsoor.repository.UserCredentialRepository;
import com.xaqsoor.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
class UserDetailsServiceImp implements UserDetailsService {

    private final UserRepository userRepository;
    private final UserCredentialRepository credentialRepository;

    @Autowired
    public UserDetailsServiceImp(UserRepository userRepository, UserCredentialRepository credentialRepository) {
        this.userRepository = userRepository;
        this.credentialRepository = credentialRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        UserCredential credential = credentialRepository.findByUser(user)
                .orElseThrow(() -> new UsernameNotFoundException("Credentials not found for user: " + email));
        return new UserDetailsImpl(user,credential);
    }
}