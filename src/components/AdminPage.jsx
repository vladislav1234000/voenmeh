import React from 'react';
import { Panel, PanelHeader, Cell, Group, List } from '@vkontakte/vkui';

const AdminPage = props => {

const go = panel => {
  props.setParentState({
    adminPagePanel: panel
  });
}
  return (
    <Panel id="admin">
      <PanelHeader>Модераторская</PanelHeader>
      <Group title="Выберите раздел">
       <List>
         <Cell onClick={() => go('news')}>Добавить новость</Cell>
         <Cell onClick={() => go('noty')}>Отправить уведомление</Cell>
       </List>
     </Group>
    </Panel>
  );
}

export default AdminPage;
