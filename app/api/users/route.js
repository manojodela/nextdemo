import { NextResponse } from 'next/server';
import { userValidationSchema } from '../../lib/utils/validation';

// In-memory storage (use database in production)
let users = [];
let nextId = 1;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const userData = Object.fromEntries(formData.entries());
    
    // Handle array fields (hobbies)
    userData.hobbies = formData.getAll('hobbies[]');
    
    // Server-side validation
    await userValidationSchema.validate(userData, { abortEarly: false });
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create user object
    const newUser = {
      id: nextId++,
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    console.log('✅ Server-side: User created successfully', newUser);
    
    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      data: newUser
    }, { status: 201 });
    
  } catch (error) {
    console.error('❌ Server-side error:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;
  const search = searchParams.get('search') || '';
  
  let filteredUsers = users;
  
  if (search) {
    filteredUsers = users.filter(user => 
      user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  
  return NextResponse.json({
    success: true,
    data: paginatedUsers,
    pagination: {
      page,
      limit,
      total: filteredUsers.length,
      totalPages: Math.ceil(filteredUsers.length / limit)
    }
  });
}