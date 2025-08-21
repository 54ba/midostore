"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { useCart } from '@/app/contexts/CartContext';
import {
  ShoppingBag,
  Search,
  Crown
} from 'lucide-react';
import AuthNavigation from './AuthNavigation';

export default function Header() {
  return null;
}