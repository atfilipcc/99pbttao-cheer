/* eslint-disable import/order */
import withRoot from './landing/modules/withRoot';
// --- Post bootstrap -----
import React from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Typography from './landing/modules/components/Typography';

function About() {
  return (
    <React.Fragment>
      <Container>
        <Box mt={7} mb={12}>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            About
          </Typography>
          <Typography variant="p" gutterBottom marked="center" align="left">
            99pbttao is one of School of Applied Technology's bootcamp's mob. It
            consists of Andrea, Filip, Njål and Michal. This app came to life
            during the last two weeks of the bootcamp where the mob was given a
            task to create their final project. It should be an app that would
            make the society better. We decided to bring people together,
            because you are the ones who can make this happen. Through our app
            you can connect to different nursing homes in Oslo and make their
            inhabitants' day happier by having a chat with them. This app is
            attempting to highlight the issue of the loneliness of the elderly
            happening all around the world. As a volunteer you can call a
            nursing home and the nurses in charge will find an inhabitant
            wanting to chat over a cup of tea. It all happens from the comfort
            of your home and their home.
            <br />
            <br />
            You can simply register and log in with your gmail. You will be
            taken to the list of nursing homes in Oslo and there you can click the 'call' button to be connected to
            those through video chat.
          </Typography>
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default withRoot(About);
