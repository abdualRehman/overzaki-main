import React from 'react';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Button } from '@mui/material';

export default function Navigator({
  itemsLength,
  setPageNumber,
  pageSize,
}: {
  itemsLength: any;
  setPageNumber: any;
  pageSize: any;
}) {
  return (
    <Stack spacing={2}>
      <Pagination
        variant="outlined"
        color="primary"
        count={Math.ceil(itemsLength / pageSize)}
        renderItem={(item) => (
          <Button
            onClick={() =>
              setPageNumber(
                item.page == Math.ceil(itemsLength / pageSize) + 1
                  ? Math.ceil(itemsLength / pageSize)
                  : item.page === 0
                    ? 1
                    : item.page
              )
            }
          >
            <PaginationItem  slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} />
          </Button>
        )}
      />
    </Stack>
  );
}
