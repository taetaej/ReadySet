import { Avatar } from '../common/Avatar'
import { Section, ComponentGroup } from './Section'

export function AvatarSection() {
  return (
    <Section title="Avatars" description="사용자 및 광고주 프로필 아바타">
      <ComponentGroup label="User Avatars">
        <Avatar name="Shin Jia" type="user" size={32} userId="USER001" />
        <Avatar name="Kim Eunseo" type="user" size={40} userId="USER002" />
        <Avatar name="Lee Minho" type="user" size={48} userId="USER003" />
      </ComponentGroup>

      <ComponentGroup label="Advertiser Avatars">
        <Avatar name="삼성전자" type="advertiser" size={32} />
        <Avatar name="카카오" type="advertiser" size={40} />
        <Avatar name="네이버" type="advertiser" size={48} />
      </ComponentGroup>
    </Section>
  )
}
