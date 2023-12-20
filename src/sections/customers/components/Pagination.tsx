import React from 'react';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Button } from '@mui/material';

const Navigator = ({
  customersLength,
  setPageNumber,
  pageSize,
}: {
  customersLength: any;
  setPageNumber: any;
  pageSize: any;
}) => {
  return (
    <Stack spacing={2}>
      <Pagination
        count={Math.ceil(customersLength / pageSize)}
        renderItem={(item) => (
          <Button
            onClick={() =>
              setPageNumber(
                item.page == Math.ceil(customersLength / pageSize) + 1
                  ? Math.ceil(customersLength / pageSize)
                  : item.page === 0
                    ? 1
                    : item.page
              )
            }
          >
            <PaginationItem slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} />
          </Button>
        )}
      />
    </Stack>
  );
};

export default Navigator;
