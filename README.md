Форк [todomvc-redux-react-typescript](https://github.com/jaysoo/todomvc-redux-react-typescript)

## Установка зависимостей

```
npm install
```

## Запуск сервера разработки

```
npm start
```

Перейти [http://localhost:3000/](http://localhost:3000/).

## Компонент автодополнения TypeaheadInput

```jsx
<TypeaheadInput 
    items={[
        { text: 'apple' },
        { text: 'banana' },
        { text: 'pear' }
    ]}
    placeholder='type here'
    rowsCount={5}
    onSelect={(item) => item
)} />
```

### Props 
#### items: Array
Элементы, которые будут отображаться в списке
#### placeholder: string
Placeholder в текстовом поле
#### rowsCount: number
Количество элементов, выводимых в списке
#### onSelect: function
Параметр: элемент

Вызывается после установки значения поля ввода