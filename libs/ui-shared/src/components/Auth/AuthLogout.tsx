'use client';
import React from 'react';

import { authProvidersCodeString } from '../../lib';
import CodeView from '../CodeView';
import { useAuth } from '@futureverse/auth-react';
import { clearAllLocalStorage } from '../../utils/localStorage';

const codeString = `
'use client';
import React from 'react';

import { authProvidersCodeString } from '../../lib';
import CodeView from '../CodeView';
import { useAuth } from '@futureverse/auth-react';
import { clearAllLocalStorage } from '../../utils/localStorage';

export function AuthLogout() {
  const { signOut } = useAuth();

  return (
    <div className="card">
      <div className="inner">
        <div className="row">
          <CodeView code={codeString} helperCode={authProvidersCodeString}>
            <h3>Pass.Online Log Out</h3>
          </CodeView>
        </div>

        <div className="row">
          <button
            className="green no-margin"
            onClick={async () => {
              if (typeof window !== 'undefined' &&
                window.confirm('Do you really want to sign out?')) {
                // Clear all localStorage data
                clearAllLocalStorage();
                // Sign out
                signOut();
              }
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
`;

export function AuthLogout() {
  const { signOut } = useAuth();

  return (
    <div className="card">
      <div className="inner">
        <div className="row">
          <CodeView code={codeString} helperCode={authProvidersCodeString}>
            <h3>Pass.Online Log Out</h3>
          </CodeView>
        </div>

        <div className="row">
          <button
            className="green no-margin"
            onClick={async () => {
              if (
                typeof window !== 'undefined' &&
                window.confirm('Do you really want to sign out?')
              ) {
                // Clear all localStorage data
                clearAllLocalStorage();
                // Sign out
                signOut();
              }
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
