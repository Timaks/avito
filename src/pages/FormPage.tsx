import React from 'react';

function FormPage() {
  // разместить логику формы создания/редактирования объявления
  return (
    <div>
      <h1>Форма для объявления</h1>
      <form>
        {/* поля формы */}
        <label>
          Название:
          <input type="text" />
        </label>
        <button type="submit">Сохранить</button>
      </form>
    </div>
  );
}

export default FormPage;