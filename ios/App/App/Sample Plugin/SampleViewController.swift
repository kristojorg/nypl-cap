import Foundation
import UIKit

protocol SampleViewControllerDelegate: AnyObject {

    func didReceiveAction(_ action: SampleAction, model: SampleModel)
}

final class SampleViewController: UIViewController {

    weak var delegate: SampleViewControllerDelegate?

    var models: [SampleModel] = [] {
        didSet {
            DispatchQueue.main.async {
                self.tableView.reloadData()
            }
        }
    }

    private let tableView = UITableView()

    override func viewDidLoad() {
        setupSubviews()
    }

    private func setupSubviews() {
        let screenBounds = UIScreen.main.bounds

        let navigationBarHeight: CGFloat = 75

        let navigationBar = UINavigationBar(frame: CGRect(
            x: 0, y: 0,
            width: screenBounds.width, height: navigationBarHeight)
        )

        navigationBar.backgroundColor = .white

        let navItem = UINavigationItem()
        navItem.title = "Sample View"

        let closeBarButtonItem = UIBarButtonItem(
            barButtonSystemItem: .close, target: self, action: #selector(self.closeButtonTapped)
        )

        let addBarButtonItem = UIBarButtonItem(
            barButtonSystemItem: .add, target: self, action: #selector(self.addButtonTapped)
        )

        navItem.leftBarButtonItem = closeBarButtonItem
        navItem.rightBarButtonItem = addBarButtonItem

        navigationBar.items = [navItem]

        view.addSubview(navigationBar)
        view.addSubview(tableView)

        view.frame = CGRect(
            x: 0, y: navigationBarHeight,
            width: UIScreen.main.bounds.width, height: (screenBounds.height - navigationBarHeight)
        )

        tableView.frame = view.frame
        tableView.delegate = self
        tableView.dataSource = self
    }

    @objc func closeButtonTapped() {
        dismiss(animated: true)
    }

    @objc func addButtonTapped() {
        promptCreate()
    }

    fileprivate func promptCreate() {
        presentAlertWithTextField(message: "New Item", placeholderText: "Title") { title in
            guard let title = title else { return }

            let model = SampleModel(id: nil, title: title)

            self.delegate?.didReceiveAction(.create, model: model)
        }
    }

    fileprivate func promptUpdate(for model: SampleModel) {
        presentAlertWithTextField(message: "Update Item", placeholderText: "Title", defaultText: model.title) { title in
            guard let title = title else { return }

            let model = SampleModel(id: model.id, title: title)

            self.delegate?.didReceiveAction(.update, model: model)
        }
    }

    private func presentAlertWithTextField(
        message: String,
        placeholderText: String? = nil,
        defaultText: String? = nil,
        completion: @escaping (String?) -> Void
    ) {
        let alertController = UIAlertController(title: nil, message: message, preferredStyle: .alert)

        alertController.addTextField { textField in
            textField.placeholder = placeholderText
            textField.text = defaultText
        }

        let confirmAction = UIAlertAction(title: "Confirm", style: .default) { [weak alertController] _ in
            completion(alertController?.textFields?.first?.text)
        }

        let cancelAction = UIAlertAction(title: "Cancel", style: .destructive)

        alertController.addAction(confirmAction)
        alertController.addAction(cancelAction)

        present(alertController, animated: true)
    }
}

extension SampleViewController: UITableViewDelegate, UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return models.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let model = models[indexPath.row]
        let reuseIdentifier = "SampleCell"

        let cell: UITableViewCell = {
            guard let cell = tableView.dequeueReusableCell(withIdentifier: reuseIdentifier) else {
                return UITableViewCell(style: .default, reuseIdentifier: reuseIdentifier)
            }
            return cell
        }()

        cell.textLabel?.text = model.title
        return cell
    }

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        let model = models[indexPath.row]

        promptUpdate(for: model)
    }

    func tableView(_ tableView: UITableView, trailingSwipeActionsConfigurationForRowAt indexPath: IndexPath) -> UISwipeActionsConfiguration? {

        let model = models[indexPath.row]

        let deleteAction = UIContextualAction(style: .destructive, title: "Delete") { [weak self] _, _, completion in
            self?.delegate?.didReceiveAction(.delete, model: model)
            completion(true)
        }

        let editAction = UIContextualAction(style: .normal, title: "Edit") { [weak self] _, _, completion in
            self?.promptUpdate(for: model)
            completion(true)
        }

        let config = UISwipeActionsConfiguration(actions: [deleteAction, editAction])
        config.performsFirstActionWithFullSwipe = false

        return config
    }
}
