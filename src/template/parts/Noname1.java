 register = (TextView) findViewById(R.id.register);
        register.setOnClickListener(this);
        login = (TextView) findViewById(R.id.login);
        login.setOnClickListener(this);
        login.setEnabled(false);
        forgetPwd = (TextView) findViewById(R.id.forget_pwd);
        forgetPwd.setOnClickListener(this);
        userNameEidt = (ClearEditText) findViewById(R.id.username);
        passwordEdit = (ClearEditText) findViewById(R.id.password);
        passwordEdit.setText("");
        userNameEidt.setOnTextWatcher(new UserNameTextWacher());
        passwordEdit.setOnTextWatcher(new PwdTextWacher());
        authCodeImg = (ImageView) findViewById(R.id.auth_code_img);
        changeAuthCode = (ImageView) findViewById(R.id.change_code);
        changeAuthCode.setOnClickListener(this);
        authCodeView = findViewById(R.id.auth_code_container);
        authCodeView.setVisibility(View.GONE);
        authCodeEdit = (ClearEditText) findViewById(R.id.auth_code_edit);
        authCodeEdit.setText("");
        autoLoginBtn = findViewById(R.id.auto_login);
        autoLoginBtn.setOnClickListener(this);
        autoLoginImg = (ImageView) findViewById(R.id.auto_login_img);
        if (regPhoneNum != null && !"".equals(regPhoneNum)) {
            userNameEidt.setText(regPhoneNum);
        } else {
            userNameEidt.setText(showupFormated());
        }
        userNameEidt.setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                String str = userNameEidt.getText().toString();
                if (!Utils.isEmpty(str) && str.contains("*")) {
                    userNameEidt.setText("");
                }
                return false;
            }
        });
        setIsAutoLogin(true);

        mVSSLine = findViewById(R.id.v_line_sms);
        mRlSSContainer = (RelativeLayout) findViewById(R.id.auth_sms_container);
        mCetSSContent = (ClearEditText) findViewById(R.id.cet_sms_content);
        mCetSSContent.setText("");
        mTvSSSend = (TextView) findViewById(R.id.tv_sms_send);
        mLlWarnLogin = (LinearLayout) findViewById(R.id.ll_warn_login);
        tvWarnLogin = (TextView) findViewById(R.id.tv_warn_login);

        mTvSSSend.setOnClickListener(this);
        mTvSSSend.setText(R.string.login_get_code);

        mTimer = new TimerUtil(59, new TimerUtil.TimerCallBack() {
            @Override
            public void timerInit() {

                mTvSSSend.setEnabled(true);
                mTvSSSend.setText(R.string.login_get_code);
                mTvSSSend.setTextColor(ExAndroid.getInstance().resources(mContext).getColor(R.color.app_color_primary));
                mTvSSSend.setBackgroundResource(R.drawable.shape_button_main_color_border);
            }

            @Override
            public void timerWorking(int time) {

                mTvSSSend.setEnabled(false);
                String temp = String.format("%d%s", time, ExAndroid.getInstance().string(mContext, R.string.text_bt_refresh_auth_code));
                mTvSSSend.setText(temp);
                mTvSSSend.setTextColor(ExAndroid.getInstance().resources(mContext).getColor(R.color.color_light_grey));
                mTvSSSend.setBackgroundResource(R.drawable.shape_button_light_grey_border);
            }

            @Override
            public void timerStop() {

                mTvSSSend.setEnabled(true);
                mTvSSSend.setText(R.string.login_get_code);
                mTvSSSend.setTextColor(ExAndroid.getInstance().resources(mContext).getColor(R.color.app_color_primary));
                mTvSSSend.setBackgroundResource(R.drawable.shape_button_main_color_border);
            }
        });
        mTimer.initTimer();

        thirdLoginFrame = (LinearLayout) findViewById(R.id.thirdLoginFrame);
        mTvQQ = (TextView) findViewById(R.id.ll_tv_qq);
        mTvQQ.setOnClickListener(this);

        mTvWeiXin = (TextView) findViewById(R.id.ll_tv_weixin);
        mTvWeiXin.setOnClickListener(this);

