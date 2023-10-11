import React, { useState } from "react";
import { Button, Container } from "@mui/material";
import { HeaderTitle } from "../../components/ui/content";
import SearchIcon from "@mui/icons-material/Search";
import { AddUser, ListUsers } from "../../components/custom-ui/users";
import { CostumBSOutlinedInput } from "../../components/ui/input/costum-input";

const Users = () => {
  const [openAddUserData, setOpenAddUserData] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <Container>
      <HeaderTitle title="Liste de Administrateurs">
        <Button variant="contained" onClick={() => setOpenAddUserData(true)}>
          Ajouter Administrateur
        </Button>
      </HeaderTitle>
      <Container sx={{ marginTop: 1 }}>
        <CostumBSOutlinedInput
          placeholder="Recherche...."
          endAdornment={<SearchIcon />}
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
        />
      </Container>
      <ListUsers searchValue={searchValue} />
      <AddUser open={openAddUserData} setOpen={setOpenAddUserData} />
    </Container>
  );
};

export default Users;
