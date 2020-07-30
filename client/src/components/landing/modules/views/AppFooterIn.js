import withRoot from '../withRoot';

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import Typography from '../components/Typography';
import TextField from '../components/TextField';

import facebook from '../../img/appFooterFacebook.svg';
import twitter from '../../img/appFooterTwitter.svg';

function Copyright() {
  return (
    <React.Fragment>
      {'© '}
      {/* <Link color="inherit" href="https://material-ui.com/"> */}
        99pbttao
      {/* </Link>{' '} */}
      {new Date().getFullYear()}
    </React.Fragment>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    backgroundColor: theme.palette.secondary.light,
  },
  container: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(8),
    display: 'flex',
  },
  iconsWrapper: {
    height: 120,
  },
  icons: {
    display: 'flex',
  },
  icon: {
    width: 48,
    height: 48,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.warning.main,
    marginRight: theme.spacing(1),
    '&:hover': {
      backgroundColor: theme.palette.warning.dark,
    },
  },
  iconicon: {
    width: 40,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    margin: 0,
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  language: {
    marginTop: theme.spacing(1),
    width: 150,
  },
}));

const LANGUAGES = [
  {
    code: 'en-US',
    name: 'English',
  },
  {
    code: 'fr-FR',
    name: 'Français',
  },
];

function AppFooterIn() {
  const classes = useStyles();

  return (
    <Typography component="footer" className={classes.root}>
      <Container className={classes.container}>
        <Grid container spacing={5}>
          <Grid item xs={6} sm={4} md={3}>
            <Grid
              container
              direction="column"
              justifycontent="flex-end"
              className={classes.iconsWrapper}
              spacing={2}
            >
              <Grid item className={classes.icons}>
                <a href="https://material-ui.com/" className={classes.icon}>
                  <img
                    src={facebook}
                    alt="Facebook"
                    className={classes.iconicon}
                  />
                </a>
                <a
                  href="https://twitter.com/MaterialUI"
                  className={classes.icon}
                >
                  <img
                    src={twitter}
                    alt="Twitter"
                    className={classes.iconicon}
                  />
                </a>
              </Grid>
              <Grid item>
                <Copyright />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="h6" marked="left" gutterBottom>
              Legal
            </Typography>
            <ul className={classes.list}>
              <li className={classes.listItem}>
                <Link href="/premium-themes/onepirate/terms/">Terms</Link>
              </li>
              <li className={classes.listItem}>
                <Link href="../../privacy/">Privacy</Link>
              </li>
            </ul>
          </Grid>
          <Grid item xs={6} sm={8} md={4}>
            <Typography variant="h6" marked="left" gutterBottom>
              Language
            </Typography>
            <TextField
              select
              SelectProps={{
                native: true,
              }}
              className={classes.language}
            >
              {LANGUAGES.map(language => (
                <option value={language.code} key={language.code}>
                  {language.name}
                </option>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Container>
    </Typography>
  );
}

export default withRoot(AppFooterIn);
