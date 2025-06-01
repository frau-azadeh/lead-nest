// src/components/common/LogoutButton.tsx

import { useAppDispatch } from '../../store/hooks';
import { logoutUser } from '../../features/auth/authSlice';
import { Button } from '../../components/ui'; // اگر دکمه خودتو ساختی

export default function LogoutButton() {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return <Button onClick={handleLogout}>خروج</Button>;
}
