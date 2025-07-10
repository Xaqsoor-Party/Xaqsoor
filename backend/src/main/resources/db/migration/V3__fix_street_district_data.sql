UPDATE users
SET district = street,
    street = ''
WHERE membership_level ='FOUNDER';