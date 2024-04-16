import { Avatar, Tooltip } from '@mui/material';
import React from 'react'
//This component literally just make the avatar based on the email logged in
const CustomAvatar = () => {
    //hashmap to give different profile colors based on the letter in the email - yes i know this is overkill but it is funny
    const colorMap: { [key: string]: string } = {
        'a': 'orangered', 'b': 'orangered', 'c': 'orangered',
        'd': 'blue', 'e': 'blue', 'f': 'blue',
        'g': 'green', 'h': 'green', 'i': 'green',
        'j': 'gold', 'k': 'gold', 'l': 'gold', //yellow is too bright
        'm': 'orange', 'n': 'orange', 'o': 'orange',
        'p': 'purple', 'q': 'purple', 'r': 'purple',
        's': 'pink', 't': 'pink', 'u': 'pink',
        'v': 'cyan', 'w': 'cyan', 'x': 'cyan',
        'y': 'magenta', 'z': 'magenta'
    };
    const email: string | null = localStorage.getItem('email');
    let avatarColor: string = 'gray';
    let avatarLetters: string;
    if (email) {
        if (email.length >= 2) {
            avatarLetters = email.substring(0, 2);
            avatarColor = colorMap[email[0].toString().toLowerCase()];
        } else {
            //email may be too short
            avatarLetters = "N";
        }
    } else {
        // case if there was no email in localstorage
        avatarLetters = "N";
    }

  return (
    <Tooltip title={email ? email : "No Email"}>
        <Avatar sx={{ bgcolor: avatarColor }}>{avatarLetters}</Avatar>
    </Tooltip>
  )
}

export default CustomAvatar