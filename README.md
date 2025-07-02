# Destroyer

A modern Angular dashboard application with customizable grid layouts and dynamic content management.

## 🚀 Features

- **Dashboard Management**: Create and manage multiple dashboards
- **Grid System**: Flexible grid layout with resizable columns and rows
- **Real-time Updates**: Dynamic content updates with NgRx state management
- **Responsive Design**: Mobile-friendly interface built with Bootstrap
- **Modern UI**: Clean interface with FontAwesome icons

## 🛠️ Technology Stack

- **Frontend**: Angular 10 with TypeScript
- **State Management**: NgRx Store & Effects
- **Styling**: Bootstrap 4 + SCSS
- **Icons**: FontAwesome
- **Testing**: Jasmine & Karma
- **Build Tool**: Angular CLI
- **Mock API**: JSON Server

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (version 12 or higher)
- npm or yarn package manager
- Angular CLI (`npm install -g @angular/cli`)

## 🚀 Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd destroyer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## 🏃‍♂️ Running the Application

### Development Server
Start the development server:
```bash
npm start
# or
ng serve
```
Navigate to `http://localhost:4200/`. The app will automatically reload when you change source files.

### Mock API Server
Start the JSON server for mock data:
```bash
npm run api
```
This will start a JSON server on `http://localhost:3000` using the `db.json` file.

### Running Both Servers
For full development, run both the Angular app and the API server in separate terminal windows.

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start development server |
| `npm run build` | Build the project for production |
| `npm test` | Run unit tests |
| `npm run lint` | Run TSLint |
| `npm run e2e` | Run end-to-end tests |
| `npm run api` | Start JSON server for mock API |

## 🏗️ Build

Build the project for production:
```bash
npm run build
```
Build artifacts will be stored in the `dist/` directory. The production build is optimized and minified.

## 🧪 Testing

### Unit Tests
Run unit tests with Karma:
```bash
npm test
```

### End-to-End Tests
Run e2e tests with Protractor:
```bash
npm run e2e
```

### Linting
Check code quality:
```bash
npm run lint
```

## 📁 Project Structure

```
src/
├── app/
│   ├── feature/          # Feature modules
│   │   ├── dashboard/    # Dashboard functionality
│   │   └── overview/     # Overview components
│   ├── shared/           # Shared components and services
│   ├── app-routing.module.ts
│   └── app.module.ts
├── assets/               # Static assets
├── environments/         # Environment configurations
└── styles.scss          # Global styles
```

## 🗄️ Mock Data

The application uses JSON Server with `db.json` for mock data. The database includes:
- Dashboard configurations
- Grid layout definitions
- Dynamic content items

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📚 Further Help

- [Angular Documentation](https://angular.io/docs)
- [Angular CLI Overview](https://angular.io/cli)
- [NgRx Documentation](https://ngrx.io/)
- [Bootstrap Documentation](https://getbootstrap.com/docs/4.5/)

## 📄 License

This project is licensed under the MIT License.
