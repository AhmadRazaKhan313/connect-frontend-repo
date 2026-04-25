import PropTypes from "prop-types";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Typography,
} from "@mui/material";

// project imports
import LogoSection from "../LogoSection";
import SearchSection from "./SearchSection";
import ProfileSection from "./ProfileSection";

// assets
import { IconMenu2 } from "@tabler/icons";
import useAppContext from "context/useAppContext";
import CustomMessageModal from "./CustomMessageModal";
import { useState, useEffect } from "react";
import jwt from "jwtservice/jwtService";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import useOrgTheme from "utils/useOrgTheme";

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
  const theme = useTheme();
  const { primaryColor } = useOrgTheme();

  const { filters, data, setFilteredData, smsBalance, getSmsBalance } =
    useAppContext();

  const [showModal, setShowModal] = useState(false);
  const [smsSwitch, setSmsSwitch] = useState(true);

  useEffect(() => {
    jwt
      .getSmsSending()
      .then((res) => {
        setSmsSwitch(res?.data?.smsSending);
      })
      .catch((err) => {});
  }, []);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const sendExpiryAlert = () => {
    jwt
      .sendExpiryAlert()
      .then((res) => {
        alert("Expiry Alert Sent");
        getSmsBalance();
      })
      .catch((err) => toast.error(err));
  };

  return (
    <>
      <Box
        sx={{
          width: 228,
          display: "flex",
          [theme.breakpoints.down("md")]: {
            width: "auto",
          },
        }}
      >
        <Box
          component="span"
          sx={{ display: { xs: "none", md: "block" }, flexGrow: 1 }}
        >
          <LogoSection />
        </Box>
        <ButtonBase sx={{ borderRadius: "12px", overflow: "hidden" }}>
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: "all .2s ease-in-out",
              background: theme.palette.secondary.light,
              color: theme.palette.secondary.dark,
              "&:hover": {
                background: theme.palette.secondary.dark,
                color: theme.palette.secondary.light,
              },
            }}
            onClick={handleLeftDrawerToggle}
            color="inherit"
          >
            <IconMenu2 stroke={1.5} size="1.3rem" />
          </Avatar>
        </ButtonBase>
      </Box>

      <SearchSection
        filters={filters}
        data={data}
        setFilteredData={setFilteredData}
      />
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />
      <div style={{ display: "flex" }}>
        <Typography sx={{ mr: 0.5, color: primaryColor }}>
          SMS Balance:{" "}
        </Typography>
        <Typography sx={{ mr: 1, color: smsBalance < 100 ? "red" : "green" }}>
          {smsBalance}
        </Typography>
      </div>
      <Button
        variant="contained"
        sx={{ mr: 2, color: "white", backgroundColor: primaryColor }}
        onClick={handleOpenModal}
      >
        Send Message
      </Button>
      <Button
        variant="contained"
        sx={{ mr: 2, color: "white", backgroundColor: primaryColor }}
        onClick={sendExpiryAlert}
      >
        Expiry Alert Message
      </Button>
      <ProfileSection />
      <CustomMessageModal open={showModal} handleClose={handleCloseModal} />
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func,
};

export default Header;