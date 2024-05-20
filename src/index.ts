const inquirer = require('inquirer');
const consola = require('consola');
// inquirer.prompt([{
//   name: 'name',
//   type: 'input',
//   message: 'What\'s your name?',
// }, {
//   name: 'age',
//   type: 'number',
//   message: 'How old are you?',
//   default: 18,
// }]).then((answers: { name: string, age: number}) => {
//   console.log(`\nHi ${answers.name}. ${answers.age}? Nice! \n`);
// });


enum MessageVariant {
    Success = 'success',
    Error = 'error',
    Info = 'info'
}

enum Action {
    List = "list",
    Add = "add",
    Remove = "remove",
    Edit = "edit",
    Quit = "quit"
  }
  
type InquirerAnswers = {
    action: Action
}

type User = {
    age: number,
    name: string
}

type Index = {
    index: number,
}

class Message {

    constructor (private content: string) {
    }

    show(): void {
        console.log(this.content);
    }

    capitalize(): void {
        this.content = this.content[0].toUpperCase() + this.content.slice(1).toLowerCase();
    }

    toUpperCase(): void {
        this.content = this.content.toUpperCase();
    }

    toLowerCase(): void {
        this.content = this.content.toLowerCase();
    }

    static showColorized(mode: MessageVariant, text: string): void {
        switch(mode) {
            case MessageVariant.Success:
                consola.success(text);
                break;
            case MessageVariant.Error:
                consola.error(text);
                break;
            default:
                consola.info(text);
        }
    }
}

class UsersData {
    private data: User[] = [];

    showAll(): void {
        Message.showColorized(MessageVariant.Info, 'Users data');
        if (this.data.length === 0) console.log('No data...');
        console.table(this.data);
    };

    add(user: User): void {
        if (user.age > 0 && user.name.length > 0) {
            this.data.push(user);
            Message.showColorized(MessageVariant.Success, 'User hes been successfully added!');
        } else {
            Message.showColorized(MessageVariant.Error, 'Wrong data!');
        }
    };

    remove(name: string): void {
        const itemIndex: number = this.data.findIndex(user => user.name === name);
        console.log(name, itemIndex);
        if (itemIndex >= 0) {
            this.data.splice(itemIndex, 1);
            Message.showColorized(MessageVariant.Success, 'User deleted!');
        } else {
            Message.showColorized(MessageVariant.Error, 'User not found...');
        }
    }

    edit(index: number, dataToUpdate: User): void {
        if (index >= 0 && index < this.data.length) {
            const user: User = {
                age: dataToUpdate.age === 0 ? this.data[index].age : dataToUpdate.age ,
                name: dataToUpdate.name.length === 0 ? this.data[index].name: dataToUpdate.name,
            };
            console.log(user);
            if (user.age > 0 && user.name.length > 0) {
                this.data[index] = user;
                Message.showColorized(MessageVariant.Success, 'User updated!');
            } else {
                Message.showColorized(MessageVariant.Error, 'Wrong data...');
            }
        } else {
            Message.showColorized(MessageVariant.Error, 'User not found...');
        }
    }
}

const users = new UsersData();

// const msg = new Message("heLlo world!");
// msg.show(); // "heLlo world!"
// msg.capitalize();
// msg.show(); // "Hello world!"
// msg.toLowerCase();
// msg.show(); // "hello world!"
// msg.toUpperCase();
// msg.show(); // "HELLO WORLD!"
// Message.showColorized(MessageVariant.Success, "Test"); // √ "Test"
// Message.showColorized(MessageVariant.Error, "Test 2"); // "x Test 2"
// Message.showColorized(MessageVariant.Info, "Test 3"); // ℹ "Test 3"

users.showAll();
users.add({ name: "Jan", age: 20 });
users.add({ name: "Adam", age: 30 });
users.add({ name: "Kasia", age: 23 });
users.add({ name: "Basia", age: -6 });
users.showAll();
users.remove("Maurycy");
users.remove("Adam");
users.edit(0, { name: 'lolek', age: 11 });
users.edit(1, { name: 'bibi', age: 0 });
users.showAll();
users.edit(0, { name: 'lolek', age: -2 });

const startApp = () => {
    inquirer.prompt([{
      name: 'action',
      type: 'input',
      message: 'How can I help you?',
    }]).then(async (answers: InquirerAnswers) => {
      switch (answers.action) {
        case Action.List:
          users.showAll();
          break;
        case Action.Add:
          const user = await inquirer.prompt([{
            name: 'name',
            type: 'input',
            message: 'Enter name',
          }, {
            name: 'age',
            type: 'number',
            message: 'Enter age',
          }]);
          users.add(user);
          break;
        case Action.Remove:
          const name = await inquirer.prompt([{
            name: 'name',
            type: 'input',
            message: 'Enter name',
          }]);
          users.remove(name.name);
          break;
        case Action.Edit:
            const { index } : Index = await inquirer.prompt([
              {
                name: 'index',
                type: 'input',
                message: 'Enter index to update',
                default: -1,
              }]);
              const data : User = await inquirer.prompt([
              {
                name: 'name',
                type: 'input',
                message: 'Enter new name',
                default: '',
              }, {
                name: 'age',
                type: 'number',
                message: 'Enter new age',
                default: 0,
              }]);
            users.edit(index, data);
            break;
        case Action.Quit:
          Message.showColorized(MessageVariant.Info, "Bye bye!");
          return;
        default:
            Message.showColorized(MessageVariant.Error, 'Command not found');
      }
  
      startApp();
    });
  }

// const users = new UsersData();
console.log("\n");
console.info("???? Welcome to the UsersApp!");
console.log("====================================");
Message.showColorized(MessageVariant.Info, "Available actions");
console.log("\n");
console.log("list – show all users");
console.log("add – add new user to the list");
console.log("remove – remove user from the list");
console.log("quit – quit the app");
console.log("\n");

startApp();
