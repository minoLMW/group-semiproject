const express = require('express');

// public/assets/js/signup.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signupForm');
  
    form.addEventListener('submit', async (event) => {
      event.preventDefault(); // 기본 제출 막기
  
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries()); // JSON으로 변환
  
      try {
        const response = await fetch('/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        const result = await response.json();
  
        if (result.success) {
          alert('🎉 회원가입 완료!');
          form.reset(); // 폼 초기화
        } else {
          alert('❗ 회원가입 실패: ' + result.message);
        }
      } catch (error) {
        console.error('오류 발생:', error);
        alert('⚠️ 서버 오류 발생');
      }
    });
  });
  