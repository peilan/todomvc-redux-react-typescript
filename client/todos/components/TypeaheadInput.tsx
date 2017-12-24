import * as React from 'react';
import * as classNames from 'classnames';
import './style.css'

interface Model {
  text: string
}

interface TypeaheadInputProps {
  items: Model[];
  placeholder: string;
  rowsCount: number;
  onSelect: (item: Model) => void
}

interface TypeaheadInputState {
  text: string,
  isOpen: boolean,
  highlighted: Model,
  filtered: Model[]
}

class TypeaheadInput extends React.Component<TypeaheadInputProps, TypeaheadInputState> {
  _ignoreBlur: boolean;
  input: HTMLInputElement;

  constructor(props: TypeaheadInputProps, context: TypeaheadInputState) {
    super(props, context);
    this.state = {
      text: '',
      isOpen: false,
      highlighted: null,
      filtered: this.getFiltered(this.props.items)
    };

    this._ignoreBlur = false;
  }

  getFiltered(items: Model[], value = '') : Model[] {
    return items.filter((item: Model) => {
      const itemText = item.text.toLowerCase();
      const inputValue = value.toLowerCase();
      return itemText.indexOf(inputValue) !== -1;
    }).slice(0, this.props.rowsCount);
  }

  handleInputChange(event) : void {
    const text = event.target.value;
    this.setState(
      (prevState, { items }) => ({
        text,
        isOpen: true,
        filtered: this.getFiltered(items, text)
      })
    );
  }

  handleInputBlur() : void {
    if (!this._ignoreBlur) {
      this.setState({
        isOpen: false
      });
    }
  }

  handleInputFocus() : void {
    this.setState(
      (prevState, { items }) => ({
        isOpen: true,
        filtered: this.getFiltered(items)   
      })
    );
  }

  handleInputKeyDown(event: React.KeyboardEvent<HTMLElement>) : void {
    const { filtered } = this.state;
    const handlers = {
      ArrowDown: (currentIndex: number) => {
        const nextIndex = currentIndex + 1;

        if (currentIndex === -1) {
          this.setState({
            highlighted: filtered[0]
          });
        } else if (nextIndex !== filtered.length) {
          this.setState({
            highlighted: filtered[nextIndex],
            text: filtered[nextIndex].text
          })
        }
      },
      ArrowUp: (currentIndex: number) => {
        if (currentIndex === -1) {
          this.setState({
            highlighted: filtered[filtered.length - 1]
          });
        } else if (currentIndex !== 0) {
          const prevIndex = currentIndex - 1;
          this.setState({
            highlighted: filtered[prevIndex],
            text: filtered[prevIndex].text
          });
        }
      },
      Enter: (currentIndex: number) => {
        const { highlighted, text } = this.state;
        this.setState({
          text,
          highlighted,
          isOpen: false
        }, () => {
          if (!highlighted) {
            this.props.onSelect({ text });
          } else {
            this.props.onSelect(highlighted);
          }
        })
      }
    }
    const { key } = event;

    if (handlers[key]) {
      event.preventDefault();
      const currentIndex = filtered.indexOf(this.state.highlighted);
      handlers[key].bind(this, currentIndex)();
    }
  }

  handleItemClick(item: Model) : void {
    this.setState({
      text: item.text,
      isOpen: false
    }, () => {
      this.props.onSelect(this.state.highlighted);
    })
  }

  handleItemMouseEnter(item: Model) : void {
    this._ignoreBlur = true;
    this.setState({
      highlighted: item
    })
  }

  handleItemMouseLeave(item: Model) : void {
    this._ignoreBlur = false;
  }

  render() {
    return (
      <div className='typeahead'>
        <input className='new-todo'
          type="text"
          placeholder={this.props.placeholder}
          value={this.state.text}
          onBlur={this.handleInputBlur.bind(this)}
          onFocus={this.handleInputFocus.bind(this)}
          onChange={this.handleInputChange.bind(this)}
          onKeyDown={this.handleInputKeyDown.bind(this)} />

        <div className={
          classNames(
            'typeahead-list',
            { 'typeahead-list__hidden': !this.state.isOpen }
          )
        }>
          {this.state.filtered.map((item, index) =>
            <div
              key={index}
              className={
                classNames(
                  'typeahead-item',
                  { 'typeahead-item__highlighted': this.state.highlighted === item }
                )
              }
              onMouseEnter={() => this.handleItemMouseEnter(item)}
              onMouseLeave={() => this.handleItemMouseLeave(item)}
              onClick={() => this.handleItemClick(item)}
              tabIndex={0}>

              {item.text}
            </div>
          )}
        </div>
      </div>
    );
  }
}


export default TypeaheadInput;
