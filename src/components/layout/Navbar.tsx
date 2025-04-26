// src/components/layout/Navbar.tsx

import { useAppSelector } from '../../store/hooks';
import LogoutButton from '../../components/common/LogoutButton';

export default function Navbar() {
  const { profile } = useAppSelector((state) => state.auth);

  return (
    <nav className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
      {/* سمت چپ: لوگو */}
      <div className="text-2xl font-bold text-blue-600">
        LeadNest CRM
      </div>

      {/* سمت راست: نام کاربر و خروج */}
      <div className="flex items-center gap-4">
        {profile && (
          <span className="text-gray-600">
            {profile.full_name} ({profile.role})
          </span>
        )}
        <LogoutButton />
      </div>
    </nav>
  );
}
