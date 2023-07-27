import 'package:flutter/material.dart';

/// Utility class for showing snackbar
class SnackbarUtils {
  /// Key for the snackbar
  static GlobalKey<ScaffoldMessengerState> snackbarKey =
      GlobalKey<ScaffoldMessengerState>();

  /// Shows a success snackbar
  static void showSuccessSnackbar({required String message}) {
    hideCurrentSnackbar();
    snackbarKey.currentState?.showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.green,
      ),
    );
  }

  /// Shows an error snackbar
  static void showErrorSnackbar({required String message}) {
    hideCurrentSnackbar();
    snackbarKey.currentState?.showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
      ),
    );
  }

  /// Shows a loading snackbar
  static void showLoadinSnackbar({String message = 'Loading...'}) {
    hideCurrentSnackbar();
    snackbarKey.currentState?.showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const SizedBox.square(
              dimension: 26,
              child: FittedBox(
                child: CircularProgressIndicator(),
              ),
            ),
            const SizedBox(
              width: 10,
            ),
            Text(message),
          ],
        ),
      ),
    );
  }

  /// Hides the current snackbar
  static void hideCurrentSnackbar() {
    snackbarKey.currentState?.hideCurrentSnackBar();
  }
}
