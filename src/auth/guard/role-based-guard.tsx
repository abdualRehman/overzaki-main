import { m } from 'framer-motion';
// @mui
import { Theme, SxProps } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// assets
import { ForbiddenIllustration } from 'src/assets/illustrations';
// components
import { MotionContainer, varBounce } from 'src/components/animate';
import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type RoleBasedGuardProp = {
  hasContent?: boolean;
  roles?: string[];
  permission?: string;
  returnBoolean: boolean;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
};

export default function RoleBasedGuard({
  hasContent,
  roles,
  permission,
  children,
  sx,
  returnBoolean,
}: RoleBasedGuardProp) {
  const { user } = useAuthContext();

  const userRoles = user?.roles || [];
  const userPermissions = user?.permissions || [];

  const hasCommonRole = userRoles.some((role: string) => roles && roles.includes(role));
  const hasCommonPermission = permission && userPermissions.includes(permission);
  if (returnBoolean) {
    if ((roles && !hasCommonRole) || (permission && !hasCommonPermission)) {
      return 'true';
    }
    return 'false';
  }
  if ((roles && !hasCommonRole) || (permission && !hasCommonPermission)) {
    return hasContent ? (
      <Container component={MotionContainer} sx={{ textAlign: 'center', ...sx }}>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Permission Denied
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            You do not have permission to access this page
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <ForbiddenIllustration
            sx={{
              height: 260,
              my: { xs: 5, sm: 10 },
            }}
          />
        </m.div>
      </Container>
    ) : null;
  }

  return <> {children} </>;
}
