import { Box, Divider, Stack, Skeleton, Typography } from '@mui/material';
import PresenterCard from '../../components/presenters/PresenterCard.jsx';
import useStaff from './useStaff.js';
import '../../css/Presenters.css';

const StaffSection = ({ section, people }) => {
  return (
    <Stack
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      sx={{ borderRadius: 4, bgcolor: 'var(--background-color)', mx: 20, px: 20, pb: 10 }}
    >
      <Box sx={{ width: '100%' }}>
        <Divider sx={{ py: 3 }}>
          <Typography variant="h2" fontSize="24px">
            {section}
          </Typography>
        </Divider>
      </Box>
      <Stack
        useFlexGap
        flexWrap="wrap"
        direction="row"
        justifyContent="center"
        className="presenters-container"
        gap={5}
      >
        {people.map((member, index) => (
          <PresenterCard
            key={index}
            name={member.name}
            photo={member.img}
            role={member.role}
            showButton={false}
            containerHeight={350}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default function PresenterPage() {
  const { staff } = useStaff();

  if (staff) {
    return (
      <Stack>
        <Typography variant="h1" fontSize="50px" sx={{ textAlign: 'center', pb: 5 }}>
          Staff Members
        </Typography>
        <Stack justifyContent="center" alignItems="center" gap={5}>
          {staff.map((item, index) => (
            <StaffSection section={item.section} people={item.people} key={index} />
          ))}
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack>
      <Typography variant="h1" fontSize="50px" sx={{ textAlign: 'center', pb: 5 }}>
        Staff Members
      </Typography>
      <Stack useFlexGap flexWrap="wrap" direction="row" justifyContent="center" gap={2}>
        {new Array(8).fill(
          <Skeleton
            variant="rounded"
            animation="wave"
            width={330}
            height={360}
            sx={{ bgColor: 'var(--background-color-lighter-20)', borderRadius: 10 }}
          />,
        )}
      </Stack>
    </Stack>
  );
}
