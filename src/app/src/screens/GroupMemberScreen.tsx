import React, { useCallback } from 'react';
import { TRPGDispatchProp } from '@redux/types/__all__';
import UserList from '@app/components/UserList';
import _isNil from 'lodash/isNil';
import { TRPGStackScreenProps, useTRPGStackNavigation } from '@app/router';
import { TMemo } from '@shared/components/TMemo';
import {
  useTRPGSelector,
  useTRPGDispatch,
} from '@shared/hooks/useTRPGSelector';
import { UserItem } from '@app/components/UserItem';
import { TIcon } from '@app/components/TComponent';
import styledTheme from '@shared/utils/theme';
import { Modal } from '@ant-design/react-native';
import { tickMember } from '@redux/actions/group';
import { showAlert } from '@redux/actions/ui';

interface Props extends TRPGStackScreenProps<'GroupMember'>, TRPGDispatchProp {
  groupMembers: string[];
}

const GroupMemberScreen: React.FC<Props> = TMemo((props) => {
  const groupUUID = props.route.params?.uuid;
  const group = useTRPGSelector((state) =>
    state.group.groups.find((x) => x.uuid === groupUUID)
  );
  const groupMembers = group?.group_members ?? [];
  const managersUUID = group?.managers_uuid ?? [];
  const ownerUUID = group?.owner_uuid ?? '';

  const dispatch = useTRPGDispatch();
  const navigation = useTRPGStackNavigation();
  const handlePress = useCallback(
    (uuid: string, name: string) => {
      navigation.navigate('Profile', {
        uuid,
        type: 'user',
        name,
      });
    },
    [navigation]
  );

  const handleLongPress = useCallback(
    (uuid: string, name: string) => {
      Modal.operation([
        {
          text: '踢出成员',
          onPress: () => {
            dispatch(
              showAlert({
                content: `确认要踢出 ${name} 么`,
                onConfirm() {
                  dispatch(tickMember(groupUUID, uuid));
                },
              })
            );
          },
        },
      ]);
    },
    [groupUUID]
  );

  const getIcon = useCallback(
    (uuid: string) => {
      if (uuid === ownerUUID) {
        return (
          <TIcon
            icon="&#xe648;"
            style={{ color: styledTheme.color.gold, fontSize: 20 }}
          />
        );
      }

      if (managersUUID.includes(uuid)) {
        return (
          <TIcon
            icon="&#xe648;"
            style={{ color: styledTheme.color.downy, fontSize: 20 }}
          />
        );
      }

      return null;
    },
    [ownerUUID, managersUUID]
  );

  return (
    <UserList
      uuids={groupMembers}
      renderItem={({ item }) => {
        const uuid = item;
        return (
          <UserItem
            uuid={uuid}
            onPress={handlePress}
            onLongPress={handleLongPress}
            suffix={getIcon(uuid)}
          />
        );
      }}
    />
  );
});
GroupMemberScreen.displayName = 'GroupMemberScreen';

export default GroupMemberScreen;
