import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Calendar, FileText, Upload, Check, XCircle, ChevronLeft } from 'lucide-react';
import { Input, Select, Spin, Tabs, message } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import ReportForm from '../components/reports/ReportForm';
import api from '../services/api';

// ... rest of the file ... 