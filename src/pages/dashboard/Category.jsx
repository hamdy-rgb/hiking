import React, { useState } from "react";
import { Button, Container } from "@mui/material";
import { HeaderTitle } from "../../components/ui/content";
import SearchIcon from "@mui/icons-material/Search";
import { CostumBSOutlinedInput } from "../../components/ui/input/costum-input";
import {
  AddCategory,
  ListCategories,
} from "../../components/custom-ui/category";

const Categories = () => {
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <Container>
      <HeaderTitle title="Liste de Catégories">
        <Button variant="contained" onClick={() => setOpenAddCategory(true)}>
          Ajouter Catégorie
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
      <ListCategories searchValue={searchValue} />
      <AddCategory open={openAddCategory} setOpen={setOpenAddCategory} />
    </Container>
  );
};

export default Categories;
