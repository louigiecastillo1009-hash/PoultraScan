import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdCalendarToday,
  MdClose,
  MdEdit,
  MdEmail,
  MdLogout,
  MdPerson,
  MdRefresh,
  MdSave,
} from 'react-icons/md';

import {
  Button,
  Notice,
  PageHeader,
  PoultraScanLoader,
  Surface,
  TextField,
} from '../../../components/index';
import { useProfile } from '../hooks/useProfile';
import { ProfileAPI } from '../api/profileApi';
import { Avatar, AvatarModal, InfoRow } from '../components/index';

export default function Profile() {
  const navigate = useNavigate();
  const { user, loading, error, saving, saveError, updateProfile, refetch } = useProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ fullname: '', email: '' });
  const [successMsg, setSuccessMsg] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState('');

  useEffect(() => {
    if (user) {
      setForm({ fullname: user.fullname || '', email: user.email || '' });
    }
  }, [user]);

  const formatDate = (value) => {
    if (!value) return '—';
    return new Date(value).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleChange = (event) => {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const handleCancel = () => {
    if (user) {
      setForm({ fullname: user.fullname || '', email: user.email || '' });
    }
    setIsEditing(false);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSuccessMsg('');
    try {
      await updateProfile(form);
      setSuccessMsg('Profile updated successfully.');
      setIsEditing(false);
    } catch {
      // saveError already set by the hook
    }
  };

  const openAvatarModal = () => {
    setAvatarError('');
    setAvatarModalOpen(true);
  };

  const closeAvatarModal = () => {
    setAvatarModalOpen(false);
    setAvatarError('');
  };

  const handleSaveAvatarFile = async (file) => {
    if (!user?.id) return;
    setUploadingAvatar(true);
    setAvatarError('');
    try {
      await ProfileAPI.uploadAvatar(user.id, file);
      await refetch();
      closeAvatarModal();
    } catch (err) {
      setAvatarError(err.message || 'Failed to upload image.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveAvatarIcon = async (iconKey) => {
    if (!user?.id) return;
    setUploadingAvatar(true);
    setAvatarError('');
    try {
      await ProfileAPI.updateProfile(user.id, { avatar_url: `icon:${iconKey}` });
      await refetch();
      closeAvatarModal();
    } catch (err) {
      setAvatarError(err.message || 'Failed to save icon.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await ProfileAPI.logout();
    } catch {
      // proceed to login regardless
    } finally {
      navigate('/login');
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="Manage your personal details and account photo."
        actions={
          <Button variant="danger-ghost" onClick={handleLogout} disabled={loggingOut}>
            <MdLogout className="text-lg" aria-hidden="true" />
            {loggingOut ? 'Logging out...' : 'Log out'}
          </Button>
        }
      />

      {loading && (
        <Surface className="mt-8 flex min-h-[320px] items-center justify-center">
          <PoultraScanLoader label="Loading profile..." size={48} />
        </Surface>
      )}

      {error && !loading && (
        <Notice
          tone="error"
          title="Could not load profile"
          className="mt-8"
          action={
            <Button variant="danger-ghost" size="sm" onClick={refetch}>
              <MdRefresh className="text-base" aria-hidden="true" />
              Try again
            </Button>
          }
        >
          {error}
        </Notice>
      )}

      {!loading && !error && user && (
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.5fr)]">
          <Surface className="flex flex-col items-center text-center">
            <Avatar
              fullname={user.fullname}
              avatarUrl={user.avatar_url}
              size="h-24 w-24 sm:h-28 sm:w-28"
              onClick={openAvatarModal}
              uploading={uploadingAvatar}
            />

            <Button variant="ghost" size="sm" className="mt-2" onClick={openAvatarModal}>
              Change photo
            </Button>

            <h2 className="mt-3 max-w-full truncate font-display text-[1.65rem] font-medium leading-tight tracking-[-0.025em] text-ink">
              {user.fullname || 'Unnamed user'}
            </h2>
            <p className="mt-1 max-w-full truncate text-[12px] text-muted">{user.email}</p>

            <div className="mt-5 w-full border-t border-ink/10 pt-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-olive">
                Member since
              </p>
              <p className="mt-1 text-[12.5px] font-semibold text-ink">
                {formatDate(user.created_at)}
              </p>
            </div>
          </Surface>

          <Surface padding="none" className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 px-5 py-4 sm:px-6">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-olive">
                  Personal information
                </p>
                <h2 className="mt-1 font-display text-[1.35rem] font-medium tracking-[-0.02em] text-ink">
                  Account details
                </h2>
              </div>
              {!isEditing && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSuccessMsg('');
                    setIsEditing(true);
                  }}
                >
                  <MdEdit className="text-base" aria-hidden="true" />
                  Edit
                </Button>
              )}
            </div>

            <div className="p-5 sm:p-6">
              {successMsg && (
                <Notice tone="success" className="mb-4">
                  {successMsg}
                </Notice>
              )}
              {saveError && (
                <Notice tone="error" title="Could not save changes" className="mb-4">
                  {saveError}
                </Notice>
              )}

              {!isEditing ? (
                <div className="divide-y divide-ink/10">
                  <InfoRow icon={MdPerson} label="Full name" value={user.fullname} />
                  <InfoRow icon={MdEmail} label="Email address" value={user.email} />
                  <InfoRow
                    icon={MdCalendarToday}
                    label="Member since"
                    value={formatDate(user.created_at)}
                  />
                </div>
              ) : (
                <form onSubmit={handleSave} className="flex flex-col gap-4">
                  <TextField
                    label="Full name"
                    id="fullname"
                    name="fullname"
                    type="text"
                    icon={MdPerson}
                    value={form.fullname}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                  />

                  <TextField
                    label="Email address"
                    id="email"
                    name="email"
                    type="email"
                    icon={MdEmail}
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />

                  <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" disabled={saving} className="flex-1">
                      {saving ? (
                        <>
                          <span
                            className="h-4 w-4 animate-spin rounded-full border-2 border-cream/35 border-t-cream"
                            aria-hidden="true"
                          />
                          Saving...
                        </>
                      ) : (
                        <>
                          <MdSave className="text-lg" aria-hidden="true" />
                          Save changes
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      className="flex-1"
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      <MdClose className="text-lg" aria-hidden="true" />
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </Surface>
        </div>
      )}

      {avatarModalOpen && (
        <AvatarModal
          currentAvatarUrl={user?.avatar_url}
          onSaveFile={handleSaveAvatarFile}
          onSaveIcon={handleSaveAvatarIcon}
          onCancel={closeAvatarModal}
          saving={uploadingAvatar}
          error={avatarError}
        />
      )}
    </div>
  );
}
