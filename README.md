# FollowUp Desk - Professional Dashboard Frontend

A modern, responsive React dashboard application with role-based access control, data management, and Excel file handling.

## ✨ Features

### 🎨 Professional Dashboard UI
- **Left Sidebar Navigation** - Collapsible sidebar with user info
- **Responsive Design** - Fully responsive for mobile and desktop
- **Modern UI** - Clean, professional interface with Tailwind CSS
- **Dark/Light Mode Ready** - Easy to extend with theme support

### 🔐 Authentication & Security
- **JWT Authentication** - Secure login with access & refresh tokens
- **Role-Based Access Control** - Admin and User roles
- **Protected Routes** - Automatic redirect for unauthorized access
- **Token Refresh** - Automatic token renewal

### 📊 Data Management
- **Advanced Data Table** - Sortable, paginated records table
- **Mobile Cards View** - Card layout for mobile devices
- **Real-time Updates** - Instant data refresh after operations
- **Excel Integration** - Upload and download Excel files

### 🔍 Filtering & Search
- **Advanced Filters** - Multiple filter options
- **Search Functionality** - Search by person name
- **Date Range Filters** - Filter by payment dates
- **Active Filter Indicators** - Visual feedback for active filters

### ✏️ Record Management (Admin Only)
- **Excel Upload** - Drag & drop file upload with validation
- **Record Updates** - Edit records with form validation
- **Bulk Operations** - Upload multiple records at once

### 📱 Responsive Features
- **Mobile-First Design** - Optimized for mobile devices
- **Touch-Friendly** - Large touch targets
- **Adaptive Layouts** - Different views for mobile/desktop
- **Collapsible Sidebar** - Mobile-friendly navigation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Configuration

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000/api
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 📋 Default Credentials

- **Admin**: `admin@example.com` / `admin123`
- **User**: `user@example.com` / `user123`

## 🎯 Features by Role

### 👑 Admin
- ✅ Upload Excel files
- ✅ Update records
- ✅ View all records
- ✅ Filter and search
- ✅ Download reports

### 👤 User
- ✅ View records
- ✅ Filter and search
- ✅ Download reports
- ❌ Upload files (restricted)
- ❌ Update records (restricted)

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── DashboardLayout.tsx    # Main dashboard layout
│   │   ├── Sidebar.tsx             # Left sidebar navigation
│   │   ├── RecordTable.tsx         # Data table component
│   │   ├── RecordFilters.tsx       # Filter component
│   │   ├── UploadModal.tsx         # Excel upload modal
│   │   ├── UpdateRecordModal.tsx   # Record edit modal
│   │   └── ProtectedRoute.tsx     # Route protection
│   ├── pages/
│   │   ├── Login.tsx               # Login page
│   │   └── Records.tsx             # Main records page
│   ├── services/
│   │   ├── api.ts                  # Axios configuration
│   │   ├── authService.ts          # Auth API calls
│   │   └── recordService.ts        # Records API calls
│   ├── context/
│   │   └── AuthContext.tsx          # Auth state management
│   ├── App.tsx                     # Main app component
│   └── main.tsx                    # Entry point
```

## 🎨 UI Components

### Dashboard Layout
- Fixed sidebar on desktop
- Collapsible sidebar on mobile
- Top navigation bar
- Responsive main content area

### Data Table
- Desktop: Full table with all columns
- Mobile: Card-based layout
- Pagination with page numbers
- Loading states
- Empty states

### Forms & Modals
- Form validation
- Error handling
- Loading indicators
- Success messages
- Responsive modals

## 🔧 Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Heroicons** - Icons
- **date-fns** - Date formatting

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (Card layout)
- **Tablet**: 768px - 1024px (Table layout)
- **Desktop**: > 1024px (Full table with sidebar)

## ✅ Validation

- Email format validation
- Password strength checks
- File type validation
- File size limits (10MB)
- Date range validation
- Required field validation
- Character limits for text fields

## 🎯 API Integration

All API calls are properly integrated with:
- Automatic token refresh
- Error handling
- Loading states
- Success/error notifications
- Request/response interceptors

## 📝 Notes

- The sidebar automatically closes on mobile after navigation
- Filters persist across page refreshes
- Pagination resets when filters change
- All forms have proper validation
- Error messages are user-friendly
- Loading states provide feedback
